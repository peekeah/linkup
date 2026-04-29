import {
  ChangeEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "@/components/ui/search";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ChatContext, ChatHistory, PrivateChatHistory, ChatOrPrivateHistory } from "@/store/chat";
import { cx } from "class-variance-authority";
import { Separator } from "@/components/ui/separator";
import useSendMessage from "@/hooks/useSendMessage";
import { SupportedOutgoingCommunityMessages } from "@/@types/community";
import { SupportedChatMessages } from "@/@types/chat";
import InputAlert from "./InputAlert";
import { Button } from "@/components/ui/button";
import { getDate } from "@/lib/utils";
import { toast } from "sonner";
import { IconPlus, IconUser } from "@tabler/icons-react";

const categories = [
  "Technology", "Design", "Business", "Career", "Education",
  "Health & Fitness", "Entertainment", "Travel & Lifestyle",
  "Creative Arts", "Social & Community",
];

const isPrivateChat = (chat: ChatOrPrivateHistory): chat is PrivateChatHistory =>
  chat && "recipientId" in chat;

const isCommunityChat = (chat: ChatOrPrivateHistory): chat is ChatHistory =>
  chat && "communityId" in chat;

interface ListPanelProps {
  onSelectChat?: (chat: ChatOrPrivateHistory) => void;
  disableHighliteSelected?: boolean;
}

const ListPanel = ({ onSelectChat, disableHighliteSelected }: ListPanelProps) => {
  const { state, updateSelectedChat } = useContext(ChatContext);
  const { chatHistory, selectedChat, privateChats } = state;

  const [searchFilter, setSearchFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"communities" | "people">("communities");
  const [community, setCommunity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const hasHandledNavigation = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendMessage = useSendMessage();

  const tab = searchParams.get("tab") as "communities" | "people" | null;
  const chatId = searchParams.get("chat");

  // Stable select handler — no ref gymnastics needed
  const handleSelectChat = useCallback(
    (chat: ChatOrPrivateHistory) => {
      updateSelectedChat(chat);
      if (isCommunityChat(chat)) {
        sendMessage({
          type: SupportedChatMessages.GetChat,
          payload: { roomId: chat.communityId },
        });
      } else {
        sendMessage({
          type: SupportedChatMessages.GetPrivateChat,
          payload: { recipientId: chat.recipientId },
        });
      }
      // Call onSelectChat for mobile control if provided
      onSelectChat?.(chat);
    },
    [sendMessage, updateSelectedChat, onSelectChat]
  );

  // Handle URL-driven navigation once on mount
  useEffect(() => {
    if (hasHandledNavigation.current) return;
    hasHandledNavigation.current = true;

    if (tab === "people" && chatId) {
      setActiveTab("people");
    }
  }, [searchParams]);

  // Handle chatId-based selection once privateChats is available
  useEffect(() => {
    if (!chatId || !tab || tab !== "people") return;
    if (!privateChats.length) return;

    const target = privateChats.find((c) => c.recipientId === chatId);
    if (target) {
      handleSelectChat(target);
    }
  }, [privateChats, chatId, tab]); // runs whenever privateChats loads/updates

  // Auto-select first community when tab is active and none is selected
  useEffect(() => {
    if (activeTab !== "communities") return;
    if (chatId && tab === "people") return; // don't override params-driven selection
    // Don't auto-select on mobile when disableHighliteSelected is true
    if (disableHighliteSelected) return;
    
    const communityChats = chatHistory.filter(isCommunityChat);
    if (communityChats.length > 0 && (!selectedChat || isPrivateChat(selectedChat))) {
      handleSelectChat(communityChats[0]);
    }
  }, [activeTab, chatHistory, disableHighliteSelected]);

  // Auto-select first private chat when tab is active and none is selected
  useEffect(() => {
    if (activeTab !== "people") return;
    if (chatId && tab === "people") return; // params flow takes priority
    // Don't auto-select on mobile when disableHighliteSelected is true
    if (disableHighliteSelected) return;
    if (privateChats.length > 0 && (!selectedChat || isCommunityChat(selectedChat))) {
      handleSelectChat(privateChats[0]);
    }
  }, [activeTab, privateChats, disableHighliteSelected]);

  // Scroll detection for scrollbar visibility
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let isScrolling = false;

    const handleScroll = () => {
      if (!isScrolling) {
        // Add scrolling class when scroll starts
        scrollContainer.classList.add('scrolling');
        scrollContainer.classList.add('recently-scrolled');
        isScrolling = true;
      }
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set timeout to remove classes after scroll ends
      scrollTimeoutRef.current = setTimeout(() => {
        scrollContainer.classList.remove('scrolling');
        scrollContainer.classList.remove('recently-scrolled');
        isScrolling = false;
      }, 1500); // Keep visible for 1.5 seconds after scroll stops
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Derived filtered lists — keep as pure computation, no state
  const communityChats = chatHistory.filter(isCommunityChat);
  const filteredChats = searchFilter
    ? communityChats.filter((c) =>
      c.communityName.toLowerCase().includes(searchFilter.toLowerCase())
    )
    : communityChats;

  const filteredPrivateChats = (() => {
    const base = searchFilter
      ? privateChats.filter((c) =>
        c.recipientName.toLowerCase().includes(searchFilter.toLowerCase())
      )
      : [...privateChats];

    // Prepend selectedChat if it's a private chat not yet in the list
    if (
      selectedChat &&
      isPrivateChat(selectedChat) &&
      !base.some((c) => c.recipientId === selectedChat.recipientId)
    ) {
      base.unshift(selectedChat);
    }

    return base;
  })();

  const handleAddCommunity = () => {
    if (!selectedCategory) {
      toast("Error", { description: "Please select a category for the community" });
      return;
    }
    sendMessage({
      type: SupportedOutgoingCommunityMessages.CreateCommunity,
      payload: { name: community, category: selectedCategory },
    });
    toast("Community", { description: "Community created successfully" });
    setCommunity("");
    setSelectedCategory("");
    setIsModalOpen(false);
  };

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchFilter(e.target.value);
  };

  const onModalClose = () => {
    setCommunity("");
    setSelectedCategory("");
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col lg:min-w-sm overflow-hidden">
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
              <Button
                size="icon"
                className="rounded-md size-6"
                onClick={() => setIsModalOpen(true)}
              >
                <IconPlus />
              </Button>
            }
            onChange={(e) => setCommunity(e.target.value)}
            onSubmit={handleAddCommunity}
            onClose={onModalClose}
            showCategorySelect={true}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />
        )}
      </div>

      {/* Chat List */}
      <div ref={scrollContainerRef} className="flex-1 chat-scroll overflow-y-auto">
        {activeTab === "communities" ? (
          filteredChats.length === 0 ? (
            <div className="p-4 opacity-75">No communities found</div>
          ) : (
            filteredChats.map((item, index) => (
              <div
                key={item.communityId}
                className={cx(
                  "cursor-pointer hover:bg-primary/30",
                  !disableHighliteSelected && isCommunityChat(selectedChat!) && selectedChat.communityId === item.communityId
                    ? "bg-primary/70 hover:bg-primary/30"
                    : ""
                )}
                onClick={() => handleSelectChat(item)}
              >
                {index === 0 && <Separator orientation="horizontal" />}
                <div className="flex gap-3 p-3 items-center min-w-0 overflow-hidden">
                  <Avatar className="shadow-md shrink-0">
                    <AvatarImage><IconUser /></AvatarImage>
                    <AvatarFallback><IconUser /></AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <div className="text-heading">{item.communityName}</div>
                      <div className="text-sm opacity-60">{getDate(item?.date)}</div>
                    </div>
                    <div className="text-sm opacity-40 truncate">{item.message}</div>
                  </div>
                </div>
                <Separator />
              </div>
            ))
          )
        ) : filteredPrivateChats.length === 0 ? (
          <div className="p-4 opacity-75">No private chats found</div>
        ) : (
          filteredPrivateChats.map((item, index) => (
            <div
              key={item.recipientId}
              className={cx(
                "cursor-pointer hover:bg-primary/30",
                !disableHighliteSelected && isPrivateChat(selectedChat!) && selectedChat.recipientId === item.recipientId
                  ? "bg-primary/70 hover:bg-primary/30"
                  : ""
              )}
              onClick={() => handleSelectChat(item)}
            >
              {index === 0 && <Separator orientation="horizontal" />}
              <div className="flex gap-3 p-3 items-center overflow-hidden">
                <Avatar className="shadow-md shrink-0">
                  <AvatarImage><IconUser /></AvatarImage>
                  <AvatarFallback><IconUser /></AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between">
                    <div className="text-heading">{item.recipientName}</div>
                    <div className="text-sm opacity-60">{getDate(item?.date)}</div>
                  </div>
                  <div className="text-sm opacity-40 truncate">{item.message}</div>
                </div>
              </div>
              <Separator />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListPanel;