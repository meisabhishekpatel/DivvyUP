import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { useParams } from "react-router-dom";

export const ContactUs = () => {
  const form = useRef();
  const { email, name } = useParams();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_l06xrc1",
        "template_5uey86x",
        form.current,
        "yuM3VYdd9UykUv1dn"
      )
      .then(
        (result) => {
          console.log(result.text);
          alert("Email sent");
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <div className="flex justify-center mt-10">
      <form ref={form} onSubmit={sendEmail} class="w-full max-w-lg">
        <div class="flex flex-wrap -mx-3 mb-6 ">
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white"
              for="grid-first-name"
            >
              Name
            </label>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              name="user_name"
              value={name}
              placeholder="Jane"
            />
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-password"
            >
              Email
            </label>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="email"
              type="email"
              name="user_email"
              value={email}
            />
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-password"
            >
              Message
            </label>
            <textarea
              class=" no-resize appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none dark:focus:bg-black"
              id="message"
              name="message"
              value={"Please settle my expense"}
            ></textarea>
            <p class="text-gray-600 text-xs italic">
              Re-size can be disabled by set by resize-none / resize-y /
              resize-x / resize
            </p>
          </div>
        </div>
        <div class="md:flex md:items-center">
          <input
            type="submit"
            class="py-3 cursor-pointer px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            value="Send"
          />
          <div class="md:w-2/3"></div>
        </div>
      </form>
    </div>
  );
};
