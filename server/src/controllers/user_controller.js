import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user_model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiErrors(400, "All fields are required!");
  }

  if (!email.includes("@")) {
    throw new ApiErrors(400, "Please Correct your Email Id!");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiErrors(409, "User with username or Email already existed!");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log("Req.files: ", req.files);
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiErrors(400, "Avatar is Required!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log("cloudinary response: ", avatar);

  if (!avatar) {
    throw new ApiErrors(400, "Avatar is Required!");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiErrors(
      500,
      "Something went wrong while registering the user!"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully!"));
});

export { registerUser };
