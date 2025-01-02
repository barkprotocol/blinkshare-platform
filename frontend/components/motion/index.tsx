import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input, InputNumber } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Export animated versions of the components
export const MotionComponents = {
  Card: motion(Card),
  CardContent: motion(CardContent),
  Input: motion(Input),
  InputNumber: motion(InputNumber),
  Textarea: motion(Textarea),
  Button: motion(Button),
};
