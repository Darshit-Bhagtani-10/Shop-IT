'use client'

import Heading from "../Components/Heading";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import Input from "../Components/inputs/Input";
import { useEffect, useState } from "react";
import Button from "../Components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";

interface RegisterFormProps {
  currentUser: SafeUser | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: '',
      password: ''
    }
  });

  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/cart');
      router.refresh();
    }
  }, [currentUser, router]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios.post('/api/register', data).then(() => {
      toast.success('Account Created');

      signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      }).then((callback) => {
        if (callback?.ok) {
          router.push('/cart');
          router.refresh();
          toast.success('Logged In');
        }

        if (callback?.error) {
          toast.error(callback.error);
        }
      });
    }).catch(() => {
      toast.error("Something went wrong");
    }).finally(() => {
      setIsLoading(false);
    });
  };

  if (currentUser) {
    return <p className="text-center">Logged in Redirecting...</p>;
  }

  return (
    <>
      <Heading title="Sign Up For E-Shop" />
      <Button outline label="Sign Up With Google" icon={AiOutlineGoogle} onClick={() => { signIn('google') }} />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
      <Button label={isLoading ? "Loading" : 'Sign Up'} onClick={handleSubmit(onSubmit)} />
      <p className="text-sm">
        Already Have An Account? <Link className="underline" href='/login'>
          Log in
        </Link>
      </p>
    </>
  );
}

export default RegisterForm;
