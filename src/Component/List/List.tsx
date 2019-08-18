import React, { Component, Fragment, FormEvent } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import CardForm from "../Card/CardForm";
import Card from "../Card/Card";
import ListMenu from "./ListMenu";

class List extends Component {
  state = {
    isEdit: false,
    isSubmitted: true,
    showCardForm: false,
    cardVal: "",
    listMenuOpen: false,
    isModalOpen: '',
  };
  node: any;
  props: any;
  toggleModal = (cardId: any) => {
    this.setState((prevState: any) =>{
       return  {
        isModalOpen: (prevState.isModalOpen === '' ?  cardId : '')
    }});
  }
  
  UNSAFE_componentWillMount() {
    document.addEventListener("mousedown", this.handleSaveTitle, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleSaveTitle, false);
  }

  handleSaveTitle = (event: any) => {
    if (this.node.contains(event.target)) {
      return;
    }
    // if empty, list will be deleted when user clicks outside out if
    if (!this.props.list.title) {
      this.props.deleteList(this.props.list.id)
    } else {
      this.setState({
        isEdit: false,
        isSubmitted: true
      })
    }
  }
  componentMount = (prevProps: any) => {
    if (prevProps !== this.props) {
      if (!this.props.isSubmitted) {
        console.log("setting List Form Up");
        this.setState({ isSubmitted: false });
      }
    }
  }

  toggleTitleForm = () => {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit
    });
  };

  saveListTitle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if empty alert user
    if (!this.props.list.title) {
      alert("List cannot be blank");
    }
    // else set isEdit to false
    else {
      this.setState({
        isEdit: false,
        isSubmitted: true
      });
    }
  };

  // CARD
  toggleCardForm = () => {
    const { showCardForm } = this.state;
    this.setState({
      showCardForm: !showCardForm
    });
  };

  handleCardValChange = (event: any) => {
    this.setState({
      cardVal: event.target.value
    });
  };

  addToCard = (event: any) => {
    event.preventDefault();
    const { cardVal } = this.state;
    // if cardVal is empty, alert user
    if (!cardVal) {
      alert("please add a card");
    } else {
      this.props.addCard(this.props.list.id, cardVal);
      this.setState({
        cardVal: ""
      });
    }
    this.setState({
      showCardForm: !this.state.showCardForm
    })
  };

  toggleListMenu = () => {
    this.setState({
      listMenuOpen: !this.state.listMenuOpen
    })
  }

  render() {
    const { isEdit, isSubmitted, showCardForm, cardVal, listMenuOpen, isModalOpen } = this.state;
    const { id, title } = this.props.list;
    const { handleTitleChange, cardList, addCardDescription } = this.props;
    return (
      <Draggable
        draggableId={this.props.listId}
        index={this.props.index}
        isDragDisabled={false}
      >
        {(provided) => (
          <div
            className="list"
            {...provided.draggableProps}
            ref={provided.innerRef}
            {...provided.dragHandleProps}
          >
            <div className="list--title" ref={node => this.node = node}>
              {// if form has not been submitted, show form. Also, show form if isEdit is true
                !isSubmitted || isEdit ? (
                  <form
                    onSubmit={this.saveListTitle}
                    className="list--form" >
                    <input
                      type="text"
                      className="list--form-input"
                      autoFocus={true}
                      value={title}
                      onChange={e => handleTitleChange(id, e.target.value)}
                    />
                    {// if editing list title, no need to show "Add List" button
                      !isEdit && <button>Add List</button>}
                    {
                      isEdit && <button>Edit List</button>}
                  </form>
                ) : (
                    <Fragment>
                      <h3 onClick={this.toggleTitleForm}>{title}</h3>
                      <button className="open-list-menu-btn" onClick={this.toggleListMenu}><i className="fas fa-ellipsis-h fa-sm"></i></button>
                      {
                        listMenuOpen &&
                        <ListMenu

                          toggleListMenu={this.toggleListMenu}
                          copyList={this.props.copyList}
                          deleteList={this.props.deleteList}
                          listId={id}
                          title={title}
                        />
                      }

                    </Fragment>
                  )}
            </div>
            {provided.placeholder}

            {
              <Droppable
                droppableId={this.props.listId}
                type="task"
              >

                {(provided) => (
                  <ul
                    className="card-list"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {provided.placeholder}
                    {cardList.map((card: any, index: number) => (
                      <Card
                        key={card.id}
                        cardId={card.id}
                        content={card.content}
                        index={index}
                        card={card}
                        deleteCard={this.props.deleteCard}
                        list={this.props.list}
                        editCard={this.props.editCard}
                        addCardDescription={addCardDescription}
                        toggleModal={this.toggleModal}
                        isModalOpen={this.state.isModalOpen}
                      >
                      </Card>
                    ))}
                  </ul>
                )}
              </Droppable>
            }

            {// if showCardForm is true, show form
              showCardForm && (
                <CardForm
                  cardVal={cardVal}
                  handleCardValChange={this.handleCardValChange}
                  addToCard={this.addToCard}
                  toggleCardForm={this.toggleCardForm}
                />
              )}

            {// if isSubmitted is true, user can click "Add a card" to toggle form
              isSubmitted && !showCardForm && (
                <p className="add-card-btn" onClick={this.toggleCardForm}>
                  + <span>Add a card...</span>
                </p>
              )}            
          </div>)}

      </Draggable>
    );
  }
}

export default List;
