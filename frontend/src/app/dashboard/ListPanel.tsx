import { ChangeEventHandler, useCallback, useContext, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "@/components/ui/search";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { ChatContext, ChatHistory, PrivateChatHistory, ChatOrPrivateHistory } from "@/store/chat";
import { cx } from "class-variance-authority";
import { Separator } from "@/components/ui/separator";
import useSendMessage from "@/hooks/useSendMessage";
import { SupportedOutgoingCommunityMessages } from "@/@types/community";
import { SupportedChatMessages } from "@/@types/chat";
import { SupportedOutgoingUserMessages } from "@/@types/user";
import InputAlert from "./InputAlert";
import { Button } from "@/components/ui/button";
import { getDate } from "@/lib/utils";
import { toast } from "sonner";
import { IconPlus, IconUser } from "@tabler/icons-react";
import { AvatarImage } from "@radix-ui/react-avatar";

const categories = [
  "Technology",
  "Design",
  "Business",
  "Career",
  "Education",
  "Health & Fitness",
  "Entertainment",
  "Travel & Lifestyle",
  "Creative Arts",
  "Social & Community"
];


const ListPanel = () => {

  const { state, updateSelectedChat } = useContext(ChatContext);
  const { chatHistory, selectedChat, privateChats } = state;
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredChats, setFilteredChats] = useState<ChatHistory[]>([]);
  const [filteredPrivateChats, setFilteredPrivateChats] = useState<PrivateChatHistory[]>([]);
  const [activeTab, setActiveTab] = useState<"communities" | "people">("communities");
  const searchParams = useSearchParams();
  const [hasHandledNavigation, setHasHandledNavigation] = useState(false);

  const sendMessage = useSendMessage();
  const [community, setCommunity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectChatRef = useRef<(chat: ChatOrPrivateHistory) => void>(() => {});
  
  const handleSelectChat = useCallback((chat: ChatOrPrivateHistory) => {
    updateSelectedChat(chat)
    if ('communityId' in chat) {
      sendMessage({
        type: SupportedChatMessages.GetChat,
        payload: {
          roomId: (chat as ChatHistory).communityId
        }
      })
    } else {
      sendMessage({
        type: SupportedChatMessages.GetPrivateChat,
        payload: {
          recipientId: (chat as PrivateChatHistory).recipientId
        }
      })
    }
  }, [sendMessage, updateSelectedChat])
  
  handleSelectChatRef.current = handleSelectChat;

  useEffect(() => {
    // Handle URL parameters for navigation from people page
    if (!hasHandledNavigation) {
      const tab = searchParams.get('tab') as 'communities' | 'people';
      const chatId = searchParams.get('chat');
      
      if (tab === 'people' && chatId) {
        setActiveTab('people');
        setHasHandledNavigation(true);
        
        // Find and select the specific private chat
        const targetChat = privateChats.find(chat => chat.recipientId === chatId);
        if (targetChat) {
          handleSelectChat(targetChat);
        }
        return;
      }
      
      setHasHandledNavigation(true);
    }

    if (activeTab === "communities" && chatHistory?.length) {
      const communityChats = chatHistory.filter(chat => 'communityId' in chat) as ChatHistory[];
      setFilteredChats(communityChats);
      
      // Always select the first community if none is selected
      if (!selectedChat || !('communityId' in selectedChat)) {
        if (communityChats.length > 0) {
          handleSelectChat(communityChats[0]);
        }
      }
    }
  }, [chatHistory, selectedChat, activeTab, searchParams, privateChats, hasHandledNavigation, handleSelectChat])

  useEffect(() => {
    if (activeTab === "people" && privateChats?.length) {
      setFilteredPrivateChats(privateChats);
      
      // Always select the first private chat if none is selected
      if (!selectedChat || !('recipientId' in selectedChat)) {
        if (privateChats.length > 0) {
          handleSelectChat(privateChats[0]);
        }
      }
    }
  }, [privateChats, selectedChat, activeTab, handleSelectChat])

  useEffect(() => {
    if (activeTab === "communities") {
      const communityChats = chatHistory.filter(chat => 'communityId' in chat) as ChatHistory[];
      
      if (!searchFilter) {
        setFilteredChats(communityChats);
        return;
      }
      
      const filtered = communityChats.filter(chat =>
        chat.communityName.toLowerCase().includes(searchFilter.toLowerCase())
      );
      setFilteredChats(filtered);
    } else {
      if (!searchFilter) {
        setFilteredPrivateChats(privateChats);
        return;
      }
      
      const filtered = privateChats.filter(chat =>
        chat.recipientName.toLowerCase().includes(searchFilter.toLowerCase())
      );
      setFilteredPrivateChats(filtered);
    }
  }, [chatHistory, privateChats, searchFilter, activeTab])

  const handleAddCommunity = () => {
    if (!selectedCategory) {
      toast("Error", {
        description: "Please select a category for the community"
      })
      return
    }

    sendMessage({
      type: SupportedOutgoingCommunityMessages.CreateCommunity,
      payload: {
        name: community,
        category: selectedCategory,
      }
    })

    toast("Community", {
      description: "Community created Successfully"
    })
    setCommunity("")
    setSelectedCategory("")
    setIsModalOpen(false)
  }

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCommunity(e.target.value)
  }

  const onModalClose = () => {
    setCommunity("")
    setSelectedCategory("")
  }

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchFilter(e.target.value)
  }

  return (
    <div className="h-full lg:min-w-sm">
      <div className="p-2 py-3">
        <Search
          className="rounded-full h-12 flex-1"
          placeholder="Search"
          value={searchFilter}
          onChange={handleSearchChange}
        />
      </div>
      <Separator orientation="horizontal" />
      
      {/* Tab Navigation */}
      <div className="flex items-center justify-between p-3">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "communities" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("communities")}
            className="text-xs"
          >
            Communities
          </Button>
          <Button
            variant={activeTab === "people" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("people")}
            className="text-xs"
          >
            People
          </Button>
        </div>
        {activeTab === "communities" && (
          <InputAlert
            open={isModalOpen}
            title="Add community"
            placeholder="Community name"
            value={community}
            triggerButton={
              <Button size={"icon"} className="rounded-md size-6" onClick={() => setIsModalOpen(true)}>
                <IconPlus />
              </Button>
            }
            onChange={onInputChange}
            onSubmit={handleAddCommunity}
            onClose={() => {
              onModalClose();
              setIsModalOpen(false);
            }}
            showCategorySelect={true}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />
        )}
      </div>
      
      <div>
        {activeTab === "communities" ? (
          !filteredChats?.length ? (
            <div className="p-4 opacity-75">No communities found</div>
          ) : (
            filteredChats?.map((item, index) => (
              <div key={item.communityId} className={
                cx(
                  "cursor-pointer hover:bg-primary/30",
                  selectedChat?.type !== 'private' && selectedChat?.communityId === item.communityId ? "bg-primary/70 hover:bg-primary/30" : ""
                )
              }
                onClick={() => handleSelectChat(item)}
              >
                {index === 0 && <Separator orientation="horizontal" />}

                <div className="flex gap-3 p-3 items-center">
                  <Avatar className="shadow-md">
                    <AvatarImage><IconUser /></AvatarImage>
                    <AvatarFallback><IconUser /></AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="text-heading">{item.communityName}</div>
                      <div className="text-sm opacity-60">{getDate(item?.date)}</div>
                    </div>
                    <div className="text-sm opacity-40">{item.message}</div>
                  </div>
                </div>
                <Separator />
              </div>
            ))
          )
        ) : (
          !filteredPrivateChats?.length ? (
            <div className="p-4 opacity-75">No private chats found</div>
          ) : (
            filteredPrivateChats?.map((item, index) => (
              <div key={item.recipientId} className={
                cx(
                  "cursor-pointer hover:bg-primary/30",
                  selectedChat?.type === 'private' && selectedChat?.recipientId === item.recipientId ? "bg-primary/70 hover:bg-primary/30" : ""
                )
              }
                onClick={() => handleSelectChat(item)}
              >
                {index === 0 && <Separator orientation="horizontal" />}

                <div className="flex gap-3 p-3 items-center">
                  <Avatar className="shadow-md">
                    <AvatarImage><IconUser /></AvatarImage>
                    <AvatarFallback><IconUser /></AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="text-heading">{item.recipientName}</div>
                      <div className="text-sm opacity-60">{getDate(item?.date)}</div>
                    </div>
                    <div className="text-sm opacity-40">{item.message}</div>
                  </div>
                </div>
                <Separator />
              </div>
            ))
          )
        )}
      </div>
    </div>
  )
}

export default ListPanel;
