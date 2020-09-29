angular.module('schemaForm').config(
    ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function (schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {
        var uib_datepicker = function (name, schema, options) {
            if ((schema.type === 'string') && (schema.format === 'uib-date')){
                var f = schemaFormProvider.stdFormObj(name, schema, options);
                f.key = options.path;
                f.type = 'uib_datepicker';
                options.lookup[sfPathProvider.stringify(options.path)] = f;
                return f;
            }
        };

        schemaFormProvider.defaults.string.unshift(uib_datepicker);

        //Add to the bootstrap directive
        schemaFormDecoratorsProvider.addMapping(
            'bootstrapDecorator',
            'uib_datepicker',
            '/wp-content/plugins/xcloud/app/shared/schema_framework/addon/ui-bootstrap-datepicker/ui-bootstrap-datepicker.html'
        );

        schemaFormDecoratorsProvider.createDirective(
            'uib_datepicker',
            '/wp-content/plugins/xcloud/app/shared/schema_framework/addon/ui-bootstrap-datepicker/ui-bootstrap-datepicker.html'
        );
    }]
);