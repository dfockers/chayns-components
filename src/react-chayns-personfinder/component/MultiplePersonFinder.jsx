import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TagInput from '../../react-chayns-tag_input/component/TagInput';
import PersonFinderData from './PersonFinderData';
import { PERSON_RELATION, LOCATION_RELATION } from '../constants/relationTypes';
import { convertToInputValue, createInputValue } from '../utils/createInputValue';
import normalizeOutput from '../utils/normalizeOutput';
import FriendsDataContainer from './data/friends/FriendsDataContainer';

export default class MultiplePersonFinder extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        showPersons: PropTypes.bool,
        showSites: PropTypes.bool,
        className: PropTypes.string,
        defaultValue: PropTypes.oneOfType([
            PropTypes.shape({
                name: PropTypes.string,
                firstName: PropTypes.string,
                lastName: PropTypes.string,
                siteId: PropTypes.string,
                personId: PropTypes.string,
            }),
            PropTypes.string,
        ]),
        defaultValues: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            siteId: PropTypes.string,
            personId: PropTypes.string,
        })),
        onAdd: PropTypes.func,
        onRemove: PropTypes.func,
        showId: PropTypes.bool,
    };

    static defaultProps = {
        onChange: null,
        showPersons: true,
        showSites: false,
        defaultValue: null,
        className: null,
        onAdd: null,
        onRemove: null,
        showId: false,
        defaultValues: [],
    };

    static PERSON = PERSON_RELATION;

    static LOCATION = LOCATION_RELATION;

    constructor(props) {
        super(props);

        this.state = {
            inputValue: createInputValue(props.defaultValue, props.showId) || '',
            selectedValue: !!props.defaultValue,
            values: props.defaultValues.map(v => ({
                text: createInputValue(v, props.showId) || '',
                value: v,
            })),
        };

        this.clear = this.clear.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleTagRemove = this.handleTagRemove.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        const { value } = this.state;

        if (!value && prevState.inputValue) {
            this.input.focus();
        }
    }

    handleOnChange(inputValue) {
        this.setState({
            inputValue,
            selectedValue: false,
        });
    }

    handleTagRemove(tag) {
        const { onRemove } = this.props;
        const { values } = this.state;
        const { value } = tag;

        this.setState({
            values: values.filter(r => r.value.type !== value.type || r.value.personId !== value.personId || r.value.siteId !== value.siteId),
        });

        if (onRemove) {
            onRemove(value);
        }
    }

    handleSelect(type, value) {
        const { onAdd, showId } = this.props;
        const { values } = this.state;
        const name = convertToInputValue(value, showId);

        if (values.find(v => (v.value.type === type
            && v.value.siteId === value.siteId
            && v.value.personId === value.personId))) {
            return;
        }

        const outValue = normalizeOutput(type, value);

        this.setState({
            inputValue: '',
            selectedValue: false,
            values: [...values, {
                text: name,
                value: outValue,
            }],
        });

        if (onAdd) {
            onAdd(outValue);
        }
    }

    clear() {
        const { onChange } = this.props;

        this.setState({
            inputValue: '',
        });

        if (onChange) {
            onChange(null);
        }
    }

    render() {
        const {
            showPersons,
            showSites,
            className,
            value: propValue, /* eslint-disable-line react/prop-types */
            defaultValue,
            showId,
            ...props
        } = this.props;
        const { inputValue, selectedValue, values } = this.state;

        return (
            <div className={classnames('cc__person-finder', className)}>
                <FriendsDataContainer>
                    <PersonFinderData
                        {...props}
                        inputComponent={TagInput}
                        inputRef={(ref) => { this.input = ref; }}
                        value={inputValue}
                        tags={values}
                        selectedValue={selectedValue}
                        onChange={this.handleOnChange}
                        onSelect={this.handleSelect}
                        onRemoveTag={this.handleTagRemove}
                        persons={showPersons}
                        sites={showSites}
                    />
                </FriendsDataContainer>
            </div>
        );
    }
}
