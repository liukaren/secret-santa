const React = require('react');

// http://stackoverflow.com/a/12646864
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

module.exports = React.createClass({
    getInitialState() {
        return { isHovered: false };
    },

    propTypes: {
        members: React.PropTypes.object.isRequired,
        handleAssign: React.PropTypes.func.isRequired
    },

    handleAssign: function() {
        const shuffledUsers = shuffleArray(Object.keys(this.props.members));
        const numUsers = shuffledUsers.length;
        let newAssignments = {};
        for (let i = 0; i < numUsers - 1; i++) {
            newAssignments[shuffledUsers[i]] = shuffledUsers[i+1];
        }
        newAssignments[shuffledUsers[numUsers - 1]] = shuffledUsers[0];

        this.props.handleAssign(newAssignments);
    },

    render: function() {
        return (
            <button id="assign-button"
                    className="btn btn-1 btn-1e"
                    type="submit"
                    onClick={ this.handleAssign }
                    onMouseEnter={ () => this.setState({ isHovered: true }) }
                    onMouseLeave={ () => this.setState({ isHovered: false }) }>
                <div className={ this.state.isHovered ? 'animated shake' : '' }>
                    Shake the hat
                </div>
            </button>
        );
    }
});
