const React = require('react');

module.exports = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        info: React.PropTypes.string
    },

    render: function() {
        return (
            <div id="assignment">
                <strong>You are the Secret Santa for:</strong>
                <span className="room-member">
                    { this.props.name }
                </span>
                { this.renderInfo() }
            </div>
        );
    },

    renderInfo: function() {
        if (!this.props.info) return null;
        return <div className="assignment-info">
            <strong>They also wanted to let you know:</strong>
            <p><pre>{ this.props.info }</pre></p>
        </div>;
    }
});
