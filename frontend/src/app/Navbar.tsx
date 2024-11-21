const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-5">
      <div className="text-[28px] font-bold font-serif">
        <span className="text-secondary">Link</span>
        <span className="text-[#777777]">up</span>
      </div>

      <div className="flex justify-between gap-3">
        <div>Home</div>
        <div>About</div>
        <div>Login</div>
        <div>Sign up</div>
      </div>

    </div>
  )
}

export default Navbar;
