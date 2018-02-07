export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Required',
            'invalidCreditCard': 'Is invalid credit card number',
            'invalidEmailAddress': 'Invalid email address',
            'invalidPassword': 'Password must be at least 4 characters long.',
            'invalidNumber':'Invalid Zip Code',
            'minlength': `Minimum length ${validatorValue.requiredLength}`
        };

        return config[validatorName];
    }

    static creditCardValidator(control) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        } else {
            return { 'invalidCreditCard': true };
        }
    }

    static numberValidator(control){
        if(control.value==null || control.value=='')
            return  null;
        if(control.value.match(/^\d+$/))
            return null;
        else
            return { 'invalidNumber': true };
    }

    static emailValidator(control) {
        if(!control.value)
            return;
        
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static passwordValidator(control) {
        // (/^
        // (?=.*\d)                //should contain at least one digit
        // (?=.*[a-z])             //should contain at least one lower case
        // (?=.*[A-Z])             //should contain at least one upper case
        // [a-zA-Z0-9]{8,}         //should contain at least 8 from the mentioned characters
        // $/)
        if (control.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)){
            return null;
        } else {
            if (!control.value.match(/^[a-zA-Z0-9]{8,}$/)) {
                return 'Password should be at least 8 characters';
            }else if(!control.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)$/)) {
                return 'Password should contain uppercase/lowercase and numbers';
            }else {
                return 'Invalid Password';
            }
        }
    }

    static phoneValidator(control) {
        if(control.value==null || control.value=='')
            return  null;
        if(control.value.length>2 && control.value.match(/^\d+$/))
            return null;
        else
            return { 'invalidPhoneNumber': true };
    }
}