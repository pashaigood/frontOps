///<reference path="../../node_modules/immutable/dist/immutable.d.ts"/>

declare module "@frontops/redux-crud" {
    export default function (name: string): {
        name: string,
        actionTypes: ActionTypes
        selectors(state): Selectors
        // @ts-ignore
        getState(state): InitialState
        actions: Actions
    };

    type ActionTypes = {
        LIST: string
        READ: string
        CREATE: string
        UPDATE: string
        REMOVE: string
    };

    type Actions = {
        list(payload:object[])
        read(id)
        create(payload: object)
        update(id, payload: object)
        remove(id)
    };

    type Selectors = {
        state()
        list(): any
        read(id): any
    };

   /* type InitialState = {
        filter: Immutable.Map<string, object>
        list: Immutable.List<object>|null
        order = null
        list = null
        pagination = null
        form = fromJS()
    }*/
}
