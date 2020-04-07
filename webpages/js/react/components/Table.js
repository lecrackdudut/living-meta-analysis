class Table extends React.Component{
    contructor(props){
        super(props);
        this.state = {
            isActive: false,
        }
    }
    render(){
        return(
            <div className="table">
                This is the table tab !
            </div>
        )
    }
}