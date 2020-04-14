import React from 'react';

function Counter(){
    const [count, setCount] = React.useState(0);
        return(
            <button
                onClick={ () => setCount(previousValue => previousValue+1)}
             >
                {count}
            </button>
        )
}

export default Counter;