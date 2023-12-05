import { useState } from 'react';
import { AuthContext } from '../context/AuhContext';
import { useContext } from 'react';
import "./UpdateProfile.css";
const UpdateProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    // Другие поля для обновления данных
  });
    const { user } = useContext(AuthContext)
    console.log('user :>> ', user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Логика для отправки данных о пользователе на сервер для обновления
    try {
      // Отправка данных на сервер
      // await fetch('URL_для_обновления_данных', {
      //   method: 'PUT',
      //   body: JSON.stringify(userData),
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Другие необходимые заголовки (например, авторизация)
      //   },
      // });
      console.log('Данные пользователя обновлены!');
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  return (
    <div className='form-container'>
      <h2>Update Profile</h2>
      <form className='form' onSubmit={handleSubmit}>
              <label>
                  <label >
                  <img src={user.profilePhoto} alt="" /> Profile Photo
              </label>
          Name:{user.userName}
          <input type="text" name="name" value={userData.name} onChange={handleChange} />
              </label>
              
        <label>
                  Email: {user.email }
          <input type="email" name="email" value={userData.email} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={userData.password} onChange={handleChange} />
        </label>
       
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
