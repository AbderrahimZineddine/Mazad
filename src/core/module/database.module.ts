import { DynamicModule, Module, Type } from '@nestjs/common';
import { ModelDefinition, MongooseModule, SchemaFactory } from '@nestjs/mongoose';

@Module({})
export class DatabaseModule {

    static forRoot(connectionName: string): DynamicModule {
        console.log(process.env.MONGO_URI)
        return MongooseModule.forRoot(
            process.env.MONGO_URI!,
            {
                dbName: connectionName,
                connectionFactory: (connection) => {
                    if (connection.readyState === 1) {
                        console.log('Database Connected successfully >> ', connection.name);
                    }
                    connection.on('disconnected', () => {
                        console.log('Database disconnected');
                    });
                    connection.on('error', (error: any) => {
                        console.log('Database connection failed! for error: ', error);
                    });
                    return connection;
                },
            }
        )
    }


    static forFeature(
        models?: ({ model: Type<any>, discriminators?: Type<any>[], } | Type<any>)[],
        connectionName?: string
    ): DynamicModule {
        if (!models) return MongooseModule.forFeature([], connectionName);

        const modelDefinitions = models.map(model => {
            if (model instanceof Function) {
                return DatabaseModule.generateModelDefinition(model, []);
            }
            return DatabaseModule.generateModelDefinition(model.model, model.discriminators || []);
        });

        return MongooseModule.forFeature(modelDefinitions, connectionName);
    }


    private static generateModelDefinition(model: Type<any>, discriminators: Type<any>[]): ModelDefinition {
        return {
            name: model.name,
            schema: SchemaFactory.createForClass(model),
            discriminators: discriminators.map(discriminator => {
                return {
                    name: discriminator.name,
                    schema: SchemaFactory.createForClass(discriminator)
                }
            }
            )
        }
    }
}