import React, {useState} from 'react';
import {
  Text,
  Alert,
  Button,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import {database, userRef} from '../apiService';
import {submitUser} from '../apiService';
import {FONTS, SIZES, APPSTYLES} from '../conts/theme';
import COLOURS from '../conts/colours';
import {getUserInfo, getUserTeam} from '../userInfo';

const EditTeam = ({navigation}) => {
  const [Id, setId] = useState();
  const [Name, setName] = useState('');
  const [Position, setPosition] = useState('');
  const [users, setUsers] = useState([]);
  const [usersInfo, setUsersInfo] = useState([]);
  const [team, setTeam] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const saveUsers = () => {
    submitUser(Id, Name, Position)
      .then(result => {
        setId(null);
        setName('');
        setPosition('');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteAllUsers = () => {
    database
      .ref('users')
      .remove()
      .then(() => {
        setUsers([]);
      });
  };

  const deleteUser = Item => {
    database()
      .ref('users/' + Item.Id)
      .remove()
      .then(() => {})
      .catch(err => {
        console.log(err);
      });
  };

  const editUser = Item => {
    setId(Item.Id);
    setName(Item.Name);
    setPosition(Item.Position);
  };
  console.log(users);

  React.useEffect(() => {
    // console.log(getUserTeam());
    // const userInfo = await userRef.once('value');
    // const teamid = userInfo.val().team;

    userRef.once('value').then(snapshot => {
      setTeam(snapshot.child('team').val());
      const team = snapshot.child('team').val();
      database.ref('/teams/' + team + '/joinCode').once('value', snapshot => {
        setJoinCode(snapshot.val());
      }),
        database
          .ref('/users/')
          .orderByChild('team')
          .equalTo(team)
          .on('value', snapshot => {
            setUsers([]);

            snapshot.forEach(function (childSnapshot) {
              setUsers(users => [...users, childSnapshot.val()]);
            });
          });
    });
    //   // const membersRef = database.ref('/teams/' + teamid + '/members/')
    //   });
    // });

    // database.ref('/teams/' + team + '/' + joinCode).once('value', snapshot => {
    //   setJoinCode(snapshot.val());
    // });

    const usersRef = database.ref('/users/');
    const OnLoadingListener = usersRef
      .orderByChild('team')
      .equalTo(team)
      .on('value', snapshot => {
        setUsers([]);

        snapshot.forEach(function (childSnapshot) {
          setUsers(users => [...users, childSnapshot.val()]);
        });
      });
    const childRemovedListener = userRef.on('child_removed', snapshot => {
      // Set Your Functioanlity Whatever you want.
      alert('Child Removed');
    });

    const childChangedListener = userRef.on('child_changed', snapshot => {
      // Set Your Functioanlity Whatever you want.
      alert('Child Updated/Changed');
    });

    return () => {
      userRef.off('value', OnLoadingListener);
      userRef.off('child_removed', childRemovedListener);
      userRef.off('child_changed', childChangedListener);
    };
  }, []);

  return (
    <ScrollView
      style={{backgroundColor: COLOURS.white, flex: 1, padding: SIZES.padding}}>
      <Text style={FONTS.h2}>My Team</Text>

      <Text>Team Join Code: {joinCode}</Text>
      {/* <TextInput
        placeholder="Name"
        value={Name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        placeholder="Position"
        value={Position}
        onChangeText={text => setPosition(text)}
      /> */}

      {/* <Button
        title="save user"
        style={styles.button}
        onPress={() => saveUsers()}
      /> */}
      {/* <Button
        title="delete all user"
        style={styles.button}
        onPress={() => deleteAllUsers()}
      /> */}
      {/* <Button
        title="delete user"
        style={styles.button}
        onPress={() => deleteUser('id')}
      />
      <Button
        title="edit user"
        style={styles.button}
        onPress={() => editUser()}
      /> */}

      {users.map((item, index) => (
        <View style={styles.itemContainer}>
          <View style={styles.infoContainer}>
            <Text style={FONTS.h3}>
              {item.firstname} {item.lastname}
            </Text>
            {item.isAdmin ? <Text>Admin</Text> : <Text>Employee</Text>}
          </View>
          <View style={styles.btnContainer}>
            <Button
              title="Edit details"
              style={styles.button}
              onPress={() => editUser()}
            />
            {!item.isAdmin ? (
              <Button
                title="Remove employee from team"
                style={styles.button}
                onPress={() => deleteUser('id')}
              />
            ) : null}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: COLOURS.light,
    flexDirection: 'column',
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 10,
  },
  infoContainer: {},
  btnContainer: {},
});

export default EditTeam;
