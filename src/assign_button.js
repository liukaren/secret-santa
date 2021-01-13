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
        let assignments = {};
        let readableAssignments = {};

        for (let i = 0; i < numUsers - 1; i++) {
            const thisUser = shuffledUsers[i];
            const nextUser = shuffledUsers[i + 1];
            assignments[thisUser] = nextUser;
            readableAssignments[this.props.members[thisUser].name] = `${
              this.props.members[nextUser].name
            } / ${this.props.members[nextUser].info}`;
        }

        const firstUser = shuffledUsers[0];
        const lastUser = shuffledUsers[numUsers - 1];
        assignments[lastUser] = firstUser
        readableAssignments[
          this.props.members[lastUser].name
        ] = `${this.props.members[firstUser].name} / ${this.props.members[firstUser].info}`;

        this.props.handleAssign(assignments, readableAssignments);
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
