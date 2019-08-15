import React, { Component } from "react";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import SimpleStorage from "react-simple-storage";
import 'normalize.css';
import "./App.scss";

// use uuid to generate random id's
import uuid from "uuid";

import "./App.scss";
import BoardNav from "./Component/BoardNav/BoardNav";

import List from "./Component/List/List";
import Scene3 from './Component/Background/images/scene8.jpg';

class App extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      styleType: { backgroundImage: `url(${Scene3})` },
      backgroundType: '',
      cards: {'sample_card': {
        id: 'sample_card',
        content: 'Sample Card'
      }},
      lists: {'sample_list':{
        id: 'sample_list',
        title: "Sample List",
        taskIds: ['sample_card']
        }
      },
      listOrder: ['sample_list']
    };
  }
  state: any;
  props: any;
  handleBackgroundColor = () => { this.setState({ backgroundType: 'Colors' }) }

  handleBackgroundImage = () => { this.setState({ backgroundType: 'Images' }) }

  handleBackgroundChange = (newBackground: string) => {
    let styleType = ((this.state.backgroundType === 'Colors') ? { backgroundColor: `${newBackground}` } : { backgroundImage: `url(${newBackground})` })
    this.setState({ styleType })
  }


  addList = () => {
    const { lists } = this.state;
    const listId = uuid().replace(/-/g, "");
    const newList = Object.assign(lists, {
      [listId]: {
        id: listId,
        title: "",
        taskIds: []
      }
    });
    this.setState({
      lists: newList
    });
    // add the created list inside the listOrder array
    for (let list in lists) {
      this.setState({
        listOrder: [...this.state.listOrder, list]
      });
    }
  };

  //We need to make copies of the cards from the original List, and add those to the list copy.
  copyCards = (cardsToCopy:any) => {
    const cards = {...this.state.cards};
    const taskIds: any = [];
    cardsToCopy.forEach((card: any) => {
      const id = uuid().replace(/-/g, "");
      cards[id] = {...cards[card]};
      cards[id].id = id;
      taskIds.push(id);
    });
    return {cards, taskIds};
  }

  copyList = (idToCopy: string, title="") => {
    const id = uuid().replace(/-/g, "");
    const listCopy = {...this.state.lists[idToCopy]};
    listCopy.id = id;
    if (title) {
      listCopy.title = title;
    }
    const index = this.state.listOrder.indexOf(idToCopy);
    const lists = {...this.state.lists, [id]:listCopy};
    const {cards, taskIds} = this.copyCards(listCopy.taskIds);
    lists[id].taskIds = taskIds;
    const listOrder = this.state.listOrder.slice(0, index+1).concat(id).concat(this.state.listOrder.slice(index+1));
    this.setState({ cards, lists, listOrder });
  }


  deleteList = (id: string) => {
    const { cards, lists, listOrder } = this.state;
    const taskIds = lists[id].taskIds;
    const newCards = { ...cards };
    taskIds.forEach((taskId: string) => delete newCards[taskId]);
    const newLists = { ...lists };
    delete newLists[id];
    let index = listOrder.indexOf(id);
    const newListOrder = [...listOrder];
    newListOrder.splice(index, 1);
    this.setState({
      cards: newCards,
      lists: newLists,
      listOrder: newListOrder
    });
  };

  // edit list title
  handleTitleChange = (id: string, e: any) => {
    const { lists } = this.state;
    for (let list in lists) {
      if (lists[list].id === id) {
        lists[list].title = e;
      }
    }
    this.setState({
      lists: lists
    });
  };

  addCard = (id: string, e: any) => {
    const { cards, lists } = this.state;
    // generate card id
    const cardId = uuid().replace(/-/g, "");
    // make a new card
    const newCard = {
      [cardId]: {
        id: cardId,
        content: e
      }
    };

    // add the new card inside the cards object
    Object.assign(cards, newCard);

    this.setState({
      cards
    });

    // loop through lists object
    for (let list in lists) {
      if (lists.hasOwnProperty(list)) {
        // check if id's are equal
        if (lists[list].id === id) {
          // loop through cards object
          for (let card in newCard) {
            // add card to taskIds array
            lists[list].taskIds = [...lists[list].taskIds, card];
          }
        }
      }
    }
    this.setState({
      lists
    });
  };

  editCard = (id: string, editedCard: any) => {
    const cards = { ...this.state.cards };
    cards[id] = editedCard;
    this.setState({
      cards
    });
  }

  // add a description to a card
  addCardDescription = (id: string, description: string) => {
    const { cards } = this.state
    for (let card in cards) {
      if (cards[card].id === id) {
        return Object.assign(cards[card], { description: description });
      }
    }
    this.setState({
      cards: { ...cards }
    })
  }




  deleteCard = (cardName: string, list: any) => {
    const newTaskIds = list.taskIds.filter((task: string) => task !== cardName);
    const newCards = { ...this.state.cards };
    delete newCards[cardName];
    const list_copy = { ...this.state.lists };
    for (let key in list_copy) {
      if (list_copy[key].id === list.id) {
        list_copy[key] = { ...list, taskIds: newTaskIds };
      }
    }
    this.setState({ cards: newCards, lists: list_copy });
  };

  onDragEnd = (result: any) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (type === 'column') {
      const newListOrder = Array.from(this.state.listOrder);
      newListOrder.splice(source.index, 1);
      newListOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state,
        listOrder: newListOrder,
      };
      this.setState(newState);
      return;
    }

    const home = this.state.lists[source.droppableId];
    const foreign = this.state.lists[destination.droppableId];

    if (home === foreign) {
      const newCardIds = Array.from(home.taskIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newList = {
        ...home,
        taskIds: newCardIds,
      }

      const newState = {
        ...this.state,
        lists: {
          ...this.state.lists,
          [newList.id]: newList,
        },
      };

      this.setState(newState);
      return;
    }

    // Moving from one list to another
    const homeTaskIds = Array.from(home.taskIds);
    homeTaskIds.splice(source.index, 1);

    const newHome = {
      ...home,
      taskIds: homeTaskIds,
    };

    const foreignTaskIds = Array.from(foreign.taskIds);
    foreignTaskIds.splice(destination.index, 0, draggableId);

    const newForeign = {
      ...foreign,
      taskIds: foreignTaskIds,
    };

    const newState = {
      ...this.state,
      lists: {
        ...this.state.lists,
        [newHome.id]: newHome,
        [newForeign.id]: newForeign,
      },
    };

    this.setState(newState);
  }


  render() {

    const { lists, cards, listOrder, styleType } = this.state;
    return (
      <div className="App" style={styleType}>
        <SimpleStorage parent={this} prefix={"Project_Management"} />
        <BoardNav
          handleBackgroundChange={this.handleBackgroundChange}
          handleBackgroundColor={this.handleBackgroundColor}
          handleBackgroundImage={this.handleBackgroundImage} />
        <DragDropContext
          onDragEnd={this.onDragEnd}
        >
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
            key={lists.id}
          >
            {(provided) => (
              <div className="App-header"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {listOrder.map((listId: string, index: number) => {
                  const list = lists[listId];
                  const cardList = list.taskIds.map((id: string) => cards[id]);
                  return (
                    <List
                      isSubmitted={list.title==="" ? false : true }
                      key={list.id}
                      listId={list.id}
                      list={list}
                      copyList={this.copyList}
                      cardList={cardList}
                      handleTitleChange={this.handleTitleChange}
                      addCard={this.addCard}
                      editCard={this.editCard}
                      deleteCard={this.deleteCard}
                      deleteList={this.deleteList}
                      addCardDescription={this.addCardDescription}
                      index={index}
                    >
                      {provided.placeholder}
                    </List>
                  );
                })}
                <button className="add-list-btn" onClick={this.addList}>
                  + Add another list
                </button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}

export default App;
