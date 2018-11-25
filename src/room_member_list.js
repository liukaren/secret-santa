const React = require('react');

module.exports = React.createClass({
    propTypes: {
        members: React.PropTypes.object.isRequired
    },

    render: function() {
        const members = this.props.members;
        const roomMembersEl = Object.keys(members).map(function(memberKey) {
            return (
                <span className="room-member" id={ memberKey } key={ memberKey }>
                    { members[memberKey] }
                </span>
            );
        });

        return (
            <div id="room-details">
                <div id="room-members-title">
                    <strong>In this room:</strong>
                </div>
                <div id="room-members">
                    {
                        Object.keys(this.props.members).length > 0 ?
                        roomMembersEl :
                        <p className="subdued-text">Nobody yet!</p>
                    }
                </div>
            </div>
        );
    }
});
