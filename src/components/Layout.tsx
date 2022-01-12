import React, { ReactNode } from 'react';
import Wrapper, { WrapperVariant } from './Wrapper';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  variant?: WrapperVariant;
}

const Layout = ({ children, variant }: LayoutProps) => (
  <>
    <Navbar />
    <Wrapper variant={variant}>{children}</Wrapper>
  </>
);

export default Layout;
