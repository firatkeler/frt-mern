import {useCallback, useReducer} from "react";

const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;

            for (const input in state.inputs) {
                if (!state.inputs[input]) {
                    continue;
                }

                if (input === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                }
                else {
                    formIsValid = formIsValid && state.inputs[input].isValid;
                }
            }

            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {
                        value: action.value,
                        isValid: action.isValid,
                    }
                },
                isValid: formIsValid,
            };
        case 'SET_DATA':
            return {
                inputs: action.inputs,
                isValid: action.isValid,
            }
        default:
            return state;
    }
};

export const useForm = (initialInputs, initialFormValidity) => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity,
    });

    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({type: 'INPUT_CHANGE', inputId: id, value: value, isValid: isValid });
    }, []);

    const setFormData = useCallback((formData, formValidity) => {
        dispatch({type: 'SET_DATA', inputs: formData, isValid: formValidity})
    }, []);

    return [formState, inputHandler, setFormData];
};
