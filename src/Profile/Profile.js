import { updateUserApi } from '../api';
import InputField from '../InputField/InputField';
import { isEqual, validate } from '../utils';
import './Profile.css';
import { useState } from 'react';
export default function Profile({user, closeProfile, setUser, allowEdit=true}){
    const[visible, setVisible] = useState(false);
    const[editMode, setEditMode] = useState(false);
    const[validators, setValidators] = useState({
        username: true,
        password: true,
        email: true,
        name: true
    });
    setTimeout(() => {
        setVisible(true);
    }, 10);
    const [editUser, setEditUser] = useState(user);
    const onEditChange = (e) => {
        const {type, value} = e;
        if(type !== 'bio' && type !== 'currentPassword' && !value){ 
            validator(type,value);
        }
        setEditUser({...editUser, [type]: value});
    }
    const validator = async (field,value) => {
        setValidators(await validate(field, validators, value));
    }
    return(
        <div className="profile-overlay">
            <div className={`profile-pop-up ${visible ? 'visible' : ''}`}>
                <div className='profile-header'>Profile</div>``
                <div className='profile-body'>
                    <div className='item'>
                        <img src={user.avatarUrl} alt="User Avatar"></img>
                    </div>
                    <br/>
                    {!editMode && <>
                    <div>Name: {user.name}</div>
                    <br/>
                    <div>Username: {user.username}</div>
                    <br/>
                    <div>
                        Email: {user.email}
                    </div>
                    <br/>
                    <div>
                    {`Bio: ${!user.bio ? "Add a bio" : user.bio}`}
                    </div>
                    <br/>
                    </>}
                    {editMode && <div className='edit-body'>
                    <InputField inputName="Name" type="text" value={editUser.name} onChange={(e) => onEditChange({type:'name', value: e.target.value})} placeholder="Enter your name" error={!validators.name ? 'Name should be 3-50 characters, letters only' : ''}/>
                    {/* <InputField inputName='Username' type="username" value={editUser.username} onChange={(e) => onEditChange({type:'username', value: e.target.value})} placeholder="Enter a username you would like to use" error={!validators.username ? 'Username must be 3-20 chars, letters/numbers/underscores only' : ''}></InputField> */}
                    {/* <InputField inputName='Password' type="password" value={editUser.password} onChange={(e) => onEditChange({type:'password', value: e.target.value})} placeholder="Enter a password you would like to use" error={!validators.password ? 'Password must contain at least 6 chars, one letter and one number' : ''}></InputField> */}
                    <InputField inputName="Current Password" type="password" value={editUser.currentPassword} onChange={(e) => onEditChange({type:'currentPassword', value: e.target.value})} placeholder="Enter current password to save changes" error={!editUser.currentPassword ? 'Please enter your current password' : ''}/>
                    <InputField inputName='Email' type="email" value={editUser.email} onChange={(e) =>onEditChange({type:'email', value: e.target.value})} placeholder="Enter your email" error={!validators.email ? 'Invalid email format' : ''}></InputField>
                    <InputField inputName='Bio' type="text" value={editUser.bio} onChange={(e) => onEditChange({type:'bio', value: e.target.value})} placeholder={!editUser.bio ? "Add a bio" : editUser.bio} error={''}></InputField>
                    </div>}
                </div>
                <div className='profile-footer'>
                {allowEdit && <div className='close-button edit-button' onClick={() => {   
                    if(editMode){
                        if(isEqual(user, editUser)){
                            setEditMode(false);
                            return;
                        }
                        if(Object.values(validators).includes(false) || !editUser.currentPassword){
                            return;
                        }
                        updateUserApi(editUser).then(data => {
                            if(data.error){
                                alert(data.error);
                            }
                            else{
                                localStorage.setItem("user", JSON.stringify(data.data));
                                setUser(data.data);
                                setEditUser(user);
                                setEditMode(false);
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                    else{
                        setEditMode(true);
                    }
                }}>{editMode ? 'Save' : 'Edit'}</div>}
                {editMode && <div className='close-button' onClick={() => setEditMode(false)}>Cancel</div>}
                <div className='close-button' onClick={closeProfile}>Close</div>
                </div>
            </div>
        </div>
    )
}