import {
  View,
  Form,
  Input,
  Textarea,
  Picker,
  Button,
} from "@tarojs/components";
import { useState } from "react";
import Taro from "@tarojs/taro";
import { PostType } from "@coshub/types";
import "./index.scss";

interface IProps {
  type: PostType;
  onSubmit: (data: any) => void;
}

export default function PostForm({ type, onSubmit }: IProps) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    images: [],
    price: type === "SKILL" ? 0 : undefined,
    skillTags: type === "SKILL" ? [] : undefined,
  });

  const handleSubmit = () => {
    if (!form.title || !form.content) {
      Taro.showToast({ title: "请填写完整信息", icon: "none" });
      return;
    }
    onSubmit(form);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <View className="form-item">
        <Input
          placeholder="标题"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.detail.value })}
        />
      </View>

      <View className="form-item">
        <Textarea
          placeholder="详细描述"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.detail.value })}
        />
      </View>

      {type === "SKILL" && (
        <>
          <View className="form-item">
            <Input
              type="number"
              placeholder="价格"
              value={form.price?.toString()}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.detail.value) })
              }
            />
          </View>

          <View className="form-item">
            <Picker
              mode="selector"
              range={["摄影", "化妆", "道具"]}
              onChange={(e) => {
                const selected = ["摄影", "化妆", "道具"][e.detail.value];
                setForm({
                  ...form,
                  skillTags: [...(form.skillTags || []), selected],
                });
              }}
            >
              <View>添加技能标签</View>
            </Picker>
          </View>
        </>
      )}

      <Button formType="submit" type="primary">
        发布
      </Button>
    </Form>
  );
}
