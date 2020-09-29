/**
 * Created by TDadam on 8/29/2017.
 */
angular.module('schemaForm').config(
    ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
        function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

            var uimask = function(name, schema, options) {
                if (schema.type === 'string' && (schema.format === 'uimask')) {
                    var f = schemaFormProvider.stdFormObj(name, schema, options);
                    f.key  = options.path;
                    f.type = 'schemauimask';
                    options.lookup[sfPathProvider.stringify(options.path)] = f;
                    return f;
                }
            };

            schemaFormProvider.defaults.string.unshift(uimask);

            //Add to the bootstrap directive
            schemaFormDecoratorsProvider.addMapping(
                'bootstrapDecorator',
                'schemauimask',
                '/wp-content/plugins/xcloud/app/shared/schema_framework/addon/uimask/schema-ui-mask.html'
            );
            schemaFormDecoratorsProvider.createDirective(
                'schemauimask',
                '/wp-content/plugins/xcloud/app/shared/schema_framework/addon/uimask/schema-ui-mask.html'
            );
        }
    ]);
