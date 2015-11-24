'use strict';

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

// Basically checks if anyone got themselves.
function isValidShuffle(array1, array2) {
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] === array2[i]) {
            return false;
        }
    }
    return true;
}

module.exports = React.createClass({
    propTypes: {
        members: React.PropTypes.object.isRequired,
        handleAssign: React.PropTypes.func.isRequired
    },

    handleAssign: function() {
        const originalUsers = Object.keys(this.props.members);
        const shuffledUsers = originalUsers.slice(0);
        do {
            shuffleArray(shuffledUsers);
        } while (!isValidShuffle(shuffledUsers, originalUsers));

        let newAssignments = {};
        for (let i in shuffledUsers) {
            newAssignments[originalUsers[i]] = shuffledUsers[i];
        }
        this.props.handleAssign.call(null, newAssignments);
    },

    handleMouseEnter: function() {
        $('#button-text').addClass('animated shake');
    },

    handleMouseLeave: function() {
        $('#button-text').removeClass('animated shake');
    },

    render: function() {
        return (
            <button id="assign-button"
                    className="btn btn-1 btn-1e"
                    type="submit"
                    onClick={ this.handleAssign }
                    onMouseEnter={ this.handleMouseEnter }
                    onMouseLeave={ this.handleMouseLeave }>
                <div id="button-text">Shake the hat</div>
            </button>
        );
    }
});
