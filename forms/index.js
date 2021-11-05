const forms = require('forms');
// some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) {
        object.widget.classes = [];
    }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createProductForm = (allCateogries, allTags) => {
    // create a new form
    return forms.create({
        // <input type="text" name="name" class="form-label"/>
        'name':fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'cost':fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'validators': [ validators.integer(), validators.min(0)]
        }),
        'description': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses':{
                'label':['form-label']
            }
        }),
        'category_id': fields.string({
            'label':'Product Category',
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label':['form-label']
            },
            'widget': widgets.select(),
            'choices': allCateogries
        }),
        'tags': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses:{
                'label':['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: allTags
        }),
        'image_url': fields.string({
            widget: widgets.hidden()
        })
        
    })
}

const createSignupForm = ()=>{
    return forms.create({
        'username': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            }
        }),
        'email': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            }
        }),
        'password': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'widget': widgets.password()
        }),
        'confirm_password': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label':['form-label']
            },
            'widget': widgets.password(),
            'validators': [validators.matchField('password')]
        })
    })
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            }
        }),
        'password': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'widget': widgets.password()
        })
    })
}

const createSearchForm = (allCateogries, allTags) => {
    return forms.create({
        'name': fields.string({            
            required: false, // optional to enter a search terms
            errorAfterField: true,
            cssClasses: {
                label:['form-label']
            }
        }),
        'min_cost': fields.string({
            required: false,
            validators: [validators.integer(), validators.min(0)],
            errorAfterField: true,
            cssClasses: {
                label:['form-label']
            }       
        }),
        'max_cost': fields.string({
            required: false,
            validators: [validators.integer(), validators.min(0)],
            errorAfterField: true,
            cssClasses: {
                label:['form-label']
            }       
        }),
        'category': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label:['form-label']
            },
            choices: allCateogries,
            widget: widgets.select()     
        }),
        'tags': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label:['form-label']
            },
            choices: allTags,
            widget: widgets.multipleSelect()
        })
    })
}

module.exports = { createProductForm, createSignupForm, createLoginForm, createSearchForm, bootstrapField};