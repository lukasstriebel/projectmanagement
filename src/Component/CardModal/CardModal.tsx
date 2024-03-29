import React, { Component, FormEvent } from 'react';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import '../CardModal/datepicker.css';
import moment, { Moment } from 'moment';
import CheckList from '../Card/CheckList';
import { any } from 'prop-types';

const dateStyle = {
    width: '75px',
    height: '30px'
}

export default class CardModal extends Component {

    constructor(props: any) {
        super(props);
        this.state = {
            calendarFocused: false,
            isSubmitted: false,
            isEdit: false,
            descripton: "",         
        }
    }
    state: {
        calendarFocused: boolean,
        isSubmitted: boolean,
        isEdit: boolean,
        createdAt?: Moment,
        descripton: string
    };
    props: any;
    onDateChange = (createdAt: any) => {
        const editedCard = { ...this.props.card, dueDate: createdAt };
        this.props.editCard(this.props.card.id, editedCard);
    }

    onCalendarFocusChange = (focused : boolean) => {
        console.log(focused);
        this.setState(() => ({ calendarFocused: focused }));
    }
    createNewCheckList = () => {
        const newCheckList: {
            title: string,
            tasks: any[]
        } = {
            title: "To-Do",
            tasks: []
        }
        const editedCard = {
            ...this.props.card,
            checkList: newCheckList
        }
        this.props.editCard(this.props.cardId, editedCard);
    }

    deleteCheckList = () => {
        const editedCard = {
            ...this.props.card
        }
        delete editedCard.checkList;
        this.props.editCard(this.props.cardId, editedCard);
    }

    addCheckListItem = (itemToAdd: any) => {
        if (itemToAdd) {
            const tasks = [...this.props.card.checkList.tasks, itemToAdd];
            const newCheckList = { ...this.props.card.checkList, tasks };
            const editedCard = {
                ...this.props.card,
                checkList: newCheckList
            }
            this.props.editCard(this.props.cardId, editedCard);
        }
    }

    changeCheckListTitle = (title: string) => {
        const checkList = {
            ...this.props.card.checkList,
            title
        }
        const editedCard = {
            ...this.props.card,
            checkList
        }
        this.props.editCard(this.props.cardId, editedCard);
    }

    editCheckListItem = (position: any, editedCheckList: any) => {
        const tasks = this.props.card.checkList.tasks.map((checklistItem: any, index: number) => (index !== position ? checklistItem : editedCheckList));

        const editedCard = {
            ...this.props.card,
            checkList: {
                title: this.props.card.checkList.title,
                tasks
            }
        }
        this.props.editCard(this.props.cardId, editedCard);
    }


    onDeleteCheckListItem = (index: number) => {
        const tasks = this.props.card.checkList.tasks.filter((item: any, currIndex: number) => currIndex !== index);
        const editedCard = {
            ...this.props.card,
            checkList: {
                title: this.props.card.checkList.title,
                tasks
            }
        }
        this.props.editCard(this.props.cardId, editedCard);
    }


    onToggleCheckBox = (index: number)  => {
        const toggledCheckListItem = this.props.card.checkList.tasks[index];
        const editedCheckListItem = { item: toggledCheckListItem.item, complete: !toggledCheckListItem.complete };
        const tasks = this.props.card.checkList.tasks.map((item: any, currIndex: number) => {
            return (currIndex === index ? editedCheckListItem : item);
        });
        const editedCard = {
            ...this.props.card,
            checkList: {
                title: this.props.card.checkList.title,
                tasks
            }
        }
        this.props.editCard(this.props.cardId, editedCard);
    }

    handleDescriptionChange = (e: any) => {
        const description = e.target.value
        this.setState({ description })
    }

    submitDescription = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { id } = this.props.card
        const { description }: any = this.state
        this.props.addCardDescription(id, description)
        this.setState({
            isSubmitted: true,
            isEdit: true
        })
    }

    editDescription = () => {
        this.setState({
            isSubmitted: false,
            isEdit: true
        })
    }

    render() {

        const currentDate = moment();
        const { card, isModalOpen, toggleModal, cardId, list, deleteCard, content } = this.props;
        const { description, isSubmitted, isEdit }: any = this.state
        return (
            <div className="card-modal" style={{ display: isModalOpen === cardId ? 'block' : 'none' }}>
                <div className="card-modal__content">
                    <div className="card-modal__content-title modal-elements">
                        <h4><i className="far fa-window-maximize left-side-icons"></i><span>{card.content}</span></h4>
                        <button onClick={toggleModal}><i className="fas fa-times close-modal"></i></button>
                    </div>
                    <div className="row">
                        <div className="left-col">
                            <div className="card__details">
                                {card.dueDate && (
                                    <div className="card__due-date">
                                        <h3 className="due-date__title"><i className="fa fa-calendar left-side-icons"></i>Due Date</h3>
                                        <p className={(currentDate.isBefore(card.dueDate) ? "due-date__date" : "due-date__date due-date__date--overdue")}>
                                            {moment(card.dueDate).format('MMM Do YYYY')}
                                        </p>
                                    </div>)}
                            </div>
                            <section className="col double-col">
                                <div className="description">
                                    <h5 className="modal-elements description__title">
                                        <i className="fas fa-align-left left-side-icons"></i>
                                        Description {
                                            // show edit button when isSubmited is false and isEdit is true
                                            !isSubmitted || isEdit && (<span onClick={this.editDescription}>Edit</span>)}</h5>
                                    {// if isSubmitted is false, show form. Else, hide form and show description
                                        !isSubmitted && <form className="description__form" onSubmit={this.submitDescription}>
                                            <textarea
                                                rows={5}
                                                className="description__form-textarea"
                                                value={description}
                                                placeholder="Add a more detailed description..."
                                                onChange={this.handleDescriptionChange}
                                            ></textarea>
                                            <button>Save</button>
                                        </form>
                                    }
                                    {
                                        isSubmitted && <p>{description}</p>
                                    }
                                </div>
                                {card.checkList && (
                                    <CheckList
                                        style={dateStyle}
                                        checkList={card.checkList}
                                        onToggleCheckBox={this.onToggleCheckBox}
                                        addCheckListItem={this.addCheckListItem}
                                        onDeleteCheckListItem={this.onDeleteCheckListItem}
                                        editCheckListItem={this.editCheckListItem}
                                        deleteCheckList={this.deleteCheckList}
                                        changeCheckListTitle={this.changeCheckListTitle}
                                    />
                                )}
                            </section>
                        </div>

                        <div className="right-col">
                            <aside className="col">
                                <p className="modal-aside-title">add to card</p>
                                <button onClick={this.createNewCheckList} disabled={card.checkList}><i className="fa fa-check-square"></i> <span>Checklist</span></button>

                                <div className="datePicker__wrapper">
                                    <div className="datePicker__icon">
                                        <i className="fa fa-calendar-alt"></i>
                                    </div>
                                    <SingleDatePicker
                                        id="1"
                                        placeholder={"Due Date"}
                                        readOnly={true}
                                        date={this.state.createdAt}
                                        onDateChange={this.onDateChange}
                                        focused={this.state.calendarFocused}
                                        onFocusChange={this.onCalendarFocusChange}
                                        hideKeyboardShortcutsPanel={true}
                                        numberOfMonths={1}
                                        isOutsideRange={() => false}
                                    />
                                </div>


                                <p className="modal-aside-title">actions</p>
                                <button onClick={() => {
                                    if (window.confirm("Delete " + content + "?")) {
                                        deleteCard(cardId, list);
                                    }
                                }

                                }><i className="fa fa-trash"></i> <span>Delete</span></button>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
