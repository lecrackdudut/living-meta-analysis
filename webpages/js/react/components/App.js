

function MenuItem(props){
    return(
        <button
            className="tablinks"
            onClick={props.onClick}
        >
            {props.name}
        </button>
    )
}

class Navbar extends React.Component{
    renderMenu(name){
        return(
            <MenuItem
                name = {name}
                onClick={() => this.handleClick(name)}
            />
        );
    }
    render(){
        return(
            <div className = "navbar">
                {this.renderMenu('basics')}
                {this.renderMenu('table')}
                {this.renderMenu('plots')}
                {this.renderMenu('aggs')}
            </div>
        )
    }
}

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: []
        };
    }

    componentDidMount() {
        fetch("https://lima.soc.port.ac.uk/api/metaanalyses/HartmutBlank/MisinformationEffect")
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
      }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
            // <ul>
            //     <li>Reference : {items.published}</li>
            //     <li>Description : {items.description}</li>
            // </ul>
            <Info
                reference={items.published}
                description={items.description}
            />
            );
        }
          
    };
}





// export default App