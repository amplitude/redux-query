import * as React from "react";

import ReduxQueryContext from "../context";

type Props = {
    children: React.ReactNode
    queriesSelector: (state: any, ...rest: any) => any
}

const Provider = (props: Props) => {
    const {queriesSelector} = props
    const value = React.useMemo(() => ({queriesSelector}), [queriesSelector])

    return (
        <ReduxQueryContext.Provider value={value}>
            {props.children}
        </ReduxQueryContext.Provider>
    )
}

export default React.memo<Props>(Provider)