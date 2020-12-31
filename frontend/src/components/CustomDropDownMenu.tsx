import React, { useContext } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from './UserContext';

const CustomDropdownMenu = () => {
    const context = useContext(UserContext);
    const user: string = `User: ${context.userId}`

    return (
        <Dropdown direction="left" style={{marginRight: 10, color: 'white', size: 10}}>
            <Dropdown.Menu>
                <Dropdown.Item text={user}/>
                <Dropdown.Item text='Log Out' onClick={()=> context.logout()}/>
            </Dropdown.Menu>
        </Dropdown>
    )
    
}

export default CustomDropdownMenu;