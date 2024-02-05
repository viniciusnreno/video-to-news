import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { getId } from "../../utils/getId";
import { schema } from "../../utils/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormData {
  youtubeLink: string;
}

const HomePage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [urlResult, setUrlResult] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const id = getId(data.youtubeLink);
    setLoading(true);

    const options = {
      method: "GET",
      url: "https://youtube-mp36.p.rapidapi.com/dl",
      headers: {
        "X-RapidAPI-Key": `${import.meta.env.VITE_YOUTUBE_API_KEY}`,
        "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
      },
      params: {
        id: id,
      },
    };

    axios(options)
      .then((res) => {
        setUrlResult(res.data.link);
        reset(); // Limpe o formulário após o envio
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container md:w-[530px] mx-auto text-center mt-8 p-4">
      <div className="bg-gray-100 p-10 rounded-lg opacity-90">
        <h1 className="font-bold text-2xl md:text-3xl mb-4">Video to News</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-4 items-end justify-center ">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                type="text"
                id="youtubeLink"
                placeholder="https://youtube.com/..."
                {...register("youtubeLink")}
              />
            </div>
            <Button type="submit">Submit</Button>
          </div>
          {errors.youtubeLink && (
            <p className="text-red-100 text-sm mt-1">
              {errors.youtubeLink.message}
            </p>
          )}
        </form>

        {loading ? (
          <div className="pt-10 mx-auto block">
            <div role="status mx-auto">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          urlResult && (
            <div className="pt-10 mx-auto block">
              <a
                className="mx-auto block"
                href={urlResult}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="link">Download MP3</Button>
              </a>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default HomePage;
