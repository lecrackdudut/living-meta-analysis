import React from 'react';
import Counter from './shared';

function PageOne(props) {
    console.log("page1");
    return(
        <h2>I'm on page 1</h2>
    );
}
function PageTwo(props) {
    return(
        <h2>I'm on page 2</h2>
    );
}

function Common(props) {

    return(
        <h2>I'm common guys</h2>
    );
}

class App extends React.Component {

    render() {
        return (
            <div>
                <h1>Hello !</h1>
                {this.handlePages()}
                <h1>And now the common element :</h1>
                <Counter />
            </div>
        );
    }

    handlePages() {
        if(this.props.page == 1) {
            return <PageOne />
        }
        else {
            return <PageTwo />
        }
    }
}

export default App;