import React, { Fragment } from "react";
import { Draggable } from "react-beautiful-dnd";
import { faTextHeight } from "@fortawesome/free-solid-svg-icons";
import CardModal from "../CardModal/CardModal"
import { fstat } from "fs";

export default class Card extends React.Component {

    props: any;
    render() : JSX.Element{
        const { toggleModal, isModalOpen, content, editCard, deleteCard, cardId, list, card, addCardDescription } = this.props;
        return (
            <Fragment>
                <Draggable draggableId={this.props.cardId} index={this.props.index}>
                    {(provided) => (
                        <li
                            className="card"
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            onClick={()=> {toggleModal(this.props.cardId)}}
                        >
                            {provided.placeholder}
                            {content}
                        
                        </li>
                    )}
                    
                </Draggable>
                <CardModal disableInteractiveElementBlocking={true} isDragDisabled={false} draggableProps={null} dragHandleProps={null} content={content} deleteCard={deleteCard} cardId={cardId} list={list} card={card} toggleModal={toggleModal} isModalOpen={isModalOpen} editCard={editCard} addCardDescription={addCardDescription} />
            </Fragment>
        )
    }
}
