import React from 'react';
import Counter from './shared';

function PageOne(props) {
    console.log("page1");
    return(
        <div>
            <h1>Welcome to page 1 ! Go to page 2 : <a href="index2.html">here</a></h1>
            <h2>I'm on page 1, <a href="index2.html">link to page 2</a></h2>
        </div>
    );
}
function PageTwo(props) {
    return(
        <div>
            <h1>Welcome to page 2 ! Go to page 1 : <a href="index.html">here</a></h1>
            <h2>I'm on page 2, <a href="/">link to page 1</a></h2>
        </div>    
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