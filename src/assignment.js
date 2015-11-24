const React = require('react');

module.exports = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            <div id="assignment">
                <strong>You are the Secret Santa for:</strong>
                <span className="room-member">
                    { this.props.name }
                </span>
            </div>
        );
    }
});
