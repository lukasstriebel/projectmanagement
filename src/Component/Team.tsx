import React, { Component } from "react";

class Team extends Component {
    state = {

    }
    props: any;
    render(): JSX.Element {

        return (
            <div className="full-team-members">
                {this.props.teamMembers.map((member: any) =>
                    <div className="team-member" key={member.id} onClick={() => this.props.deleteMember(member.id)}>
                        {member.initials}
                    </div>
                )}
            </div>
        )
    }

}

export default Team;