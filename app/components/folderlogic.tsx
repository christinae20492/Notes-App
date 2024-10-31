import React from 'react';
import { Pressable, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { styles } from '../styles/styles';
import { deleteFolder } from '../utils/folderutil';

export const FolderItem = ({ item, navigation, setFolders }) => {
  return (
    <Pressable
      style={styles.folderItem}
      onPress={() => navigation.navigate('Current Folder', { folder: item })}
      onLongPress={() => deleteFolder(item.id, setFolders, navigation)}
    >
      <Entypo name="folder" size={26} color="#115df5" />
      <Text style={styles.noteTitle}>{item.title}</Text>
    </Pressable>
  );
};