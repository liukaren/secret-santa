const React = require('react');

module.exports = React.createClass({
    propTypes: {
        handleAddUser: React.PropTypes.func.isRequired
    },

    handleAddUser: function(e) {
        e.preventDefault();
        const userName = this._nameInput.value;
        const userInfo = this._infoInput.value;
        if (!!userName.trim()) {
            this.props.handleAddUser(userName, userInfo);
        }
    },

    render: function() {
        return (
            <form onSubmit={ this.handleAddUser }>
                <label className="userFormLabel">
                    <div><strong>Who are you?</strong></div>
                    <input className="input"
                           type="text"
                           ref={ (c) => { this._nameInput = c } }
                           required />
                </label>
                <label className="userFormLabel">
                    <div><strong>Anything you want your Secret Santa to know? (optional)</strong></div>
                    <textarea className="input"
                           ref={ (c) => { this._infoInput = c } } />
                </label>
                <button className="btn btn-1 btn-1e"
                        type="submit">
                    That's me
                </button>
            </form>
        );
    }
});
