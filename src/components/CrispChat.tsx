import { useEffect } from 'react';
import { Crisp } from 'crisp-sdk-web';

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure('3d781bba-6cb8-42bd-83ae-45b093df7ded');
  }, []);

  return null;
};
