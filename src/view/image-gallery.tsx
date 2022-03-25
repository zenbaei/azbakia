import {ImageGallery} from '@georstat/react-native-image-gallery';
import React, {useState} from 'react';
import {View, Button} from 'react-native';

export const ImagesGallery = ({
  images,
}: {
  images: {
    id: number;
    url: string;
  }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const openGallery = () => setIsOpen(true);
  const closeGallery = () => setIsOpen(false);

  return (
    <View>
      <Button onPress={openGallery} title="Open Gallery" />
      <ImageGallery close={closeGallery} isOpen={isOpen} images={images} />
    </View>
  );
};
