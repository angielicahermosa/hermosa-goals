import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Platform, Alert, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { useState } from 'react';

import Button from '@/components/Button';
import CircleButton from '@/components/CircleButton';
import EmojiList from '@/components/EmojiList';
import EmojiPicker from '@/components/EmojiPicker';
import EmojiSticker from '@/components/EmojiSticker';
import IconButton from '@/components/IconButton';
import ImageViewer from '@/components/ImageViewer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const PlaceholderImage = require('@/assets/images/background-image.jpg');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | undefined>(undefined);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
    setSelectedImage(undefined);
    setPickedEmoji(undefined);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    try {
      if (!selectedImage) {
        Alert.alert('No image to save');
        return;
      }

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = selectedImage;
        link.download = 'edited-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission is required to save images.');
          return;
        }

        const filename = selectedImage.split('/').pop() ?? 'edited-image.jpg';
        const newPath = FileSystem.documentDirectory + filename;

        await FileSystem.copyAsync({
          from: selectedImage,
          to: newPath,
        });

        await MediaLibrary.saveToLibraryAsync(newPath);
        Alert.alert('Success', 'Image saved to gallery!');
      }
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'Failed to save the image.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
        {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        <GestureHandlerRootView style={styles.container}></GestureHandlerRootView>
      </View>

      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}

      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </View>
  );
}

const coffeeBrown = '#4B3621';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: coffeeBrown,
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: coffeeBrown,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: coffeeBrown,
    width: '100%',
    paddingVertical: 20,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: '#DAB49D',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 20,
  },
});
