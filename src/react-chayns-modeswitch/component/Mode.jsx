import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ModeSwitch from './ModeSwitch';

export default class Mode extends Component {
    static propTypes = {
        modes: PropTypes.arrayOf(PropTypes.number).isRequired,
        children: PropTypes.node.isRequired,
        className: PropTypes.string,
        style: PropTypes.object,
    };

    static defaultProps = {
        className: null,
        style: null,
    };

    constructor() {
        super();
        this.state = { modeId: null };
        ModeSwitch.addChangeListener(this.updatedMode);
    }

    componentWillUnmount() {
        ModeSwitch.removeChangeListener(this.updatedMode);
    }

    updatedMode = (mode) => {
        this.setState({
            modeId: mode.id,
        });
    };

    render() {
        const { modeId } = this.state;
        const {
            modes,
            children,
            className,
            style,
        } = this.props;

        if (window.chayns.utils.isArray(modes) && (modes.indexOf(modeId) !== -1 || (modes.indexOf(-1) !== -1 && !chayns.env.user.isAuthenticated))) {
            return <div className={className} style={style}>{children}</div>;
        }

        return null;
    }
}
