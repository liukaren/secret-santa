const React = require('react');

const mailSubject = encodeURIComponent('Reminder: You are the Secret Santa for...');

module.exports = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    render: function() {
        const mailBody = encodeURIComponent(this.props.name);

        return (
            <div className="reminder-button-container">
                <div>Send a reminder:</div>
                <div className="reminder-button hi-icon-effect-5 hi-icon-effect-5c">
                    <a href={ `mailto:someone@example.com?subject=${mailSubject}&body=${mailBody}` }
                       className="hi-icon hi-icon-mail">
                        Email reminder
                    </a>
                </div>
            </div>
        );
    }
});
