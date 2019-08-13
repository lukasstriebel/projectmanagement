import React, { Component } from "react";
import BoardTitleMenu from './BoardTitleMenu';
import MainMenu from "../MainMenu";
import Team from "../Team";
import uuid from "uuid";
import SimpleStorage from "react-simple-storage";

class BoardNav extends Component {

  state = {
    BoardName: "Add Board Name",

    showNameMenu: false,
    inviteMember: false,

    MMisOpen: false,
    starColor: 'white',

    team: [
      {
        id: '1',
        name: 'Nikola Tesla',
        initials: 'NT'
      },
      {
        id: '2',
        name: 'Stephen Hawking',
        initials: 'SH'
      },
      {
        id: '3',
        name: 'Isaac Newton',
        initials: 'IN'
      },
      {
        id: '4',
        name: 'Alan Turing',
        initials: 'AT'
      }

    ],
  };

  props: any;

  // -- handle main menu --

  toggleCloseButton = (e: any) => {
    e.preventDefault();
    this.setState((prevState: any) => ({
      MMisOpen: !prevState.MMisOpen
    }))
  }

  // -- update board name menu --
  handleShowMenu = () => {
    const { showNameMenu } = this.state;
    this.setState({
      showNameMenu: !showNameMenu
    });
  };

  // -- handle board name submission --
  handleNameSubmit = (e: any) => {
    e.preventDefault();
    const newName = e.target.elements.name.value
    const inputLength = newName.length;
    if (inputLength === 0) {
      alert('please enter a name')
    } else if (inputLength !== 0) {
      this.setState({
        BoardName: newName,
        showNameMenu: false,
      });
    }
  }

  // -- update member invite menu ---
  handleInviteMember = () => {
    const { inviteMember } = this.state;
    this.setState({
      inviteMember: !inviteMember
    });
  };

  // -- handle member add submission --
  handleMemberSubmit = (e: any) => {
    e.preventDefault();
    var newMember = e.target.elements.name.value
    const inputLength = newMember.length;
    if (inputLength === 0) {
      alert('please enter a name')
    } else if (inputLength !== 0) {
      this.abbreviate(newMember);
      // let updateTeam = []

    }
  }

  abbreviate = (newMember: any) => {
    let nameArr = newMember.split(' ').map((name: any) => name.charAt(0));
    let nameAbbr = nameArr.join('');
    console.log(nameAbbr);
    this.handleMemberAdd(newMember, nameAbbr)
  }

  handleMemberAdd = (newMember: any, nameAbbr: any) => {
    const { team } = this.state;
    // generate member id
    const memId = uuid().replace(/-/g, "");
    // add a new member
    const newMem = {
      id: memId,
      name: newMember,
      initials: nameAbbr
    };

    team.push(newMem);
    this.setState({
      team,
      inviteMember: false,
    });
  };

  // ------ delete member -------
  deleteMember = (id: any) => {
    const { team } = this.state;
    const willDelete = window.confirm('Remove this team member?')

    if (willDelete) {
      const newMembers = team.filter(member => member.id !== id);
      console.log(newMembers);
      this.setState({ team: newMembers });
    }

  }

  toggleYellow = () => {
    this.setState((prevState: any) => ({
      starColor: (prevState.starColor === '#f2d600' ? 'white' : '#f2d600')
    }));
  };


  render(): JSX.Element {
    const { showNameMenu, BoardName, inviteMember } = this.state;
    return (
      <div className="board-nav-wrapper">
        <SimpleStorage parent={this} prefix={"TrelloClone"} />
        <MainMenu
          menuState={false}
          MMisOpen={this.state.MMisOpen}
          toggleCloseButton={this.toggleCloseButton}
          handleBackgroundChange={this.props.handleBackgroundChange}
          handleBackgroundColor={this.props.handleBackgroundColor}
          handleBackgroundImage={this.props.handleBackgroundImage}
        />
        <div className="board-nav">
          <div className="menu-wrapper">
            <button
              onClick={this.handleShowMenu}
              className="btn-nav board-nav--title">
              {BoardName}
            </button>
            <button
              className="btn-nav board-star" onClick={this.toggleYellow} style={{ color: `${this.state.starColor}` }}>
              <i className="far fa-star"></i>
            </button>
            <span className="divider"></span>
            <span className="group">Team</span>
            <span className="divider"></span>
            <div className="full-team">

              <Team
                teamMembers={this.state.team}
                deleteMember={this.deleteMember} />
              <div className="team-size">
                {this.state.team.length}
              </div>

              <button className="invite-btn" onClick={this.handleInviteMember}><i className="fas fa-user-plus"></i>Invite</button>

              {
                inviteMember && (
                  <BoardTitleMenu
                    handleShowMenu={this.handleInviteMember}
                    handleNameSubmit={this.handleMemberSubmit}

                    title={"Add a Member"}
                    inputLabel={"Name"}
                    placeholder={"Enter name"}
                    buttonLabel={"Add"}

                  />
                )}

            </div>
          </div>

          <button className="btn-nav board-nav--menu" onClick={this.toggleCloseButton}><i className="fas fa-ellipsis-h"></i>Show Menu</button>
          {
            showNameMenu && (
              <BoardTitleMenu
                handleShowMenu={this.handleShowMenu}
                handleNameSubmit={this.handleNameSubmit}

                title={"Rename Board"}
                inputLabel={"Name"}
                placeholder={BoardName}
                buttonLabel={"Rename"}
              />
            )}

        </div>
      </div>
    )
  }
}

export default BoardNav;

// {this.state.team.map((member)=>
//   <Team
//     teamMembers={this.state.team} key={member.name}/>
//   )}  