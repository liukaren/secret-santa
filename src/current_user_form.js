const React = require('react');

module.exports = React.createClass({
    propTypes: {
        handleAddUser: React.PropTypes.func.isRequired
    },

    handleAddUser: function(e) {
        e.preventDefault();
        const userName = this._input.value;
        if (!!userName.trim()) {
            this.props.handleAddUser.call(null, userName);
        }
    },

    render: function() {
        return (
            <form onSubmit={ this.handleAddUser }>
                <label>
                    <div><strong>Who are you?</strong></div>
                    <input className="input"
                           type="text"
                           ref={ (c) => { this._input = c } } />
                </label>
                <button className="btn btn-1 btn-1e"
                        type="submit">
                    That's me
                </button>
            </form>
        );
    }
});
