import { Navbar } from "./Navbar";

export const NavbarClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar>
        {children}
      </Navbar>
    </div>
  );
};
