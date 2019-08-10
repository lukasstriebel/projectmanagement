import React, { Component } from "react";

interface TeamMember {
    id: string,
    name: string,
    initials: string
}

class Team extends Component {
    state = {

    }
    props: {
        teamMembers: TeamMember[],
        deleteMember(member: TeamMember): void 
    };
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