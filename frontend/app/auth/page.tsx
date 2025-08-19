import AuthInputGroup from "@/components/ui/AuthInputGroup";

const AuthPage = () => {
  return (
    <main className="w-screen flex justify-center items-center h-screen">
      <div className="w-[500px] h-[600px]  gap-8 flex flex-col justify-center items-center  rounded-2xl shadow-2xl">
        <h1 className="text-4xl tracking-widest font-bold text-center ">HTU</h1>
        <AuthInputGroup />
      </div>
    </main>
  );
};

export default AuthPage;
