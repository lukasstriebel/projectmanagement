import React, { Component } from 'react';
import ListItem from './ListItem';

const _calculatePercent = (items: any) : number => {
    let tasksDone: number = items.reduce((acc: number, item: any)=> item.complete ? acc + 1 : acc, 0);
    return (tasksDone / items.length) * 100;

}

class CheckList extends Component {
    state = {
        addingNewItem : false,
        editingTitle : false,
        checkListTitle : ''
    }
    props: any;
    componentDidMount = () => {
        if (this.props.checkList.title !== this.state.checkListTitle) {
            this.setState({ checkListTitle : this.props.checkList.title });
        }
    }

    handleTitleSubmitForm = () => {
        this.props.changeCheckListTitle(this.state.checkListTitle);
        this.setState({ editingTitle : false });
    }

    addNewCheckListItem = (listItem: any) => {
        if (listItem) {
            this.props.addCheckListItem({item: listItem, complete: false});
        }
        this.setState({ addingNewItem : false });
    }

    onChangeTitleForm = (title: string) => {
        if (title) {
            this.setState({ checkListTitle : title });
        }
    }

    toggleCheckListTitle = () => {
        this.setState({ editingTitle : true })
    }
    toggleNewItem = () => {
        this.setState({ addingNewItem : true })
    };


    render() {
        const { checkList, deleteCheckList, onToggleCheckBox, editCheckListItem, onDeleteCheckListItem } = this.props
        const checkListExists = (checkList && checkList.tasks);
        let progressPct = checkList.tasks.length !==0 ? _calculatePercent(checkList.tasks) : false;
        let percentageComplete = progressPct ? { width: `${progressPct}%` } : {};
        return (
            <div className="checklist">
                <div className="checklist__heading">
                    {!this.state.editingTitle ? 
                    (<h2 
                    className="checklist__title"
                    ><i className="far fa-check-square left-side-icons"></i>{checkList.title}</h2>) :
                    (<form onSubmit={(e)=> {
                        e.preventDefault();
                        this.handleTitleSubmitForm();
                    }}>
                        <input 
                        type="text" 
                        value={this.state.checkListTitle} 
                        onChange={(e)=> {
                            e.preventDefault();
                            this.onChangeTitleForm(e.target.value);
                        }}
                        />
                    </form>)
                    }
                    <button className="btn btn--checklist-edit" onClick={this.toggleCheckListTitle}>Edit...</button>
                    <button className="btn btn--checklist-delete" onClick={deleteCheckList}>Delete...</button>
                </div>
                <div className="checklist-content">
                    {
                        <div className="progress-bar">
                            <div className="progress-bar__inner" style={percentageComplete}>
                            <span className="progress-percent-display">{progressPct === 0 ? "\xa0" : progressPct + "%"}</span>
                            </div>
                            
                        </div>
                    }
                    <ul className="checklist__items">
                        {checkListExists && checkList.tasks.map((checklistItem: any, index: number) => 
                        <ListItem 
                                key={index}
                                index={index}
                                checklistItem={checklistItem}
                                item={checklistItem.item}
                                complete={checklistItem.complete}
                                onToggleCheckBox={onToggleCheckBox}
                                editCheckListItem={editCheckListItem}
                                onDeleteCheckListItem={onDeleteCheckListItem}
                            />)
                        }
                    </ul>
                    {!this.state.addingNewItem ? (
                        <p 
                        className="add-new-checkList__placeholder"
                        onClick={this.toggleNewItem}
                        >Add an item...</p>
                    ) :
                    (<form 
                    className="add-new-checkList"
                    placeholder="Add an item..."
                    onSubmit={(e: any)=>{
                        e.preventDefault();
                        this.addNewCheckListItem(e.target.elements.addItem.value);
                        }
                    }>
                        <input type="text" name="addItem"/>
                        <button className="btn btn--submit">Add</button>
                    </form>)
                    }
                </div>
            </div>
        );
    }
};

export default CheckList;