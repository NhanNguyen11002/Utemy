declare module "sort-object";

import { Prisma } from "@prisma/client";

type Lesson = Prisma.Lesson & { type: "lesson" };
type Test = Prisma.Test & { type: "test" };
type Content = Lesson | Test;
